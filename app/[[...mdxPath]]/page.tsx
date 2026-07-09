import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import type { Metadata } from 'next'
import type { ComponentType, ReactNode } from 'react'

type PageProps = {
    params: Promise<{
        mdxPath?: string[]
    }>
}

export const generateStaticParams =
    generateStaticParamsFor('mdxPath')

export async function generateMetadata(
    props: PageProps
): Promise<Metadata> {
    const params = await props.params
    const { metadata } = await importPage(params.mdxPath ?? [])
    return metadata as Metadata
}

type WrapperProps = {
    children: ReactNode
    metadata: unknown
    sourceCode: string
    toc: unknown
}

const FallbackWrapper: ComponentType<WrapperProps> = ({ children }) => <>{children}</>

function stripFrontMatter(sourceCode: string) {
    return sourceCode
        .replace(/^\uFEFF/, '')
        .replace(/^---\s*[\s\S]*?\n---\s*/, '')
        .trimStart()
}

function hasLevelOneHeading(sourceCode: string) {
    return /^#\s+\S/m.test(stripFrontMatter(sourceCode))
}

function getTitleFromPath(mdxPath: string[]) {
    const lastSegment = mdxPath.at(-1)

    if (!lastSegment || lastSegment === 'index') {
        return null
    }

    return decodeURIComponent(lastSegment).replace(/\.(md|mdx)$/, '')
}

const Wrapper =
    (getMDXComponents({}).wrapper as ComponentType<WrapperProps> | undefined) ??
    FallbackWrapper

const HeadingOne =
    (getMDXComponents({}).h1 as ComponentType<{ children: ReactNode }> | undefined) ??
    'h1'

export default async function Page(props: PageProps) {
    const params = await props.params

    const {
        default: MDXContent,
        toc,
        metadata,
        sourceCode
    } = await importPage(params.mdxPath ?? [])

    const generatedTitle = hasLevelOneHeading(sourceCode)
        ? null
        : getTitleFromPath(params.mdxPath ?? [])

    return (
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
            {generatedTitle && <HeadingOne>{generatedTitle}</HeadingOne>}
            <MDXContent {...props} params={params} />
        </Wrapper>
    )
}

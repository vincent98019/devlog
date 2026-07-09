import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'
import type { ComponentType, ImgHTMLAttributes } from 'react'

// Get the default MDX components
const themeComponents = getThemeComponents()
type ImgProps = ImgHTMLAttributes<HTMLImageElement>

const ThemeImg = themeComponents.img as ComponentType<ImgProps> | undefined

function SafeImg(props: ImgProps) {
  const alt = typeof props.alt === 'string' ? props.alt : ''

  if (!ThemeImg) return null
  return <ThemeImg {...props} alt={alt} />
}

// Merge components
export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    ...themeComponents,
    img: SafeImg,
    ...components
  }
}

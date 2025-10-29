import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links?: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links: Record<string, string> = opts?.links ?? {}
    const linkEntries = Object.entries(links)
    const year = new Date().getFullYear()

    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          © {year}{" "}
          <a href="https://www.linkedin.com/in/michal-mi%C5%A1kolci-86418626a/">Michal Miškolci</a>
        </p>
        {linkEntries.length > 0 && (
          <ul>
            {linkEntries.map(([text, link]) => (
              <li key={text}>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor

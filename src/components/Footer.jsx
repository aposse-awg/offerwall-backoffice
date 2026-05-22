import pkg from '../../package.json'


function Footer() {
  return (
    <footer>
      <p>Dashboard v{pkg.version} · Develop</p>
    </footer>
  )
}
export default Footer

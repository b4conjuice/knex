import Link from 'next/link'
import { useRouter } from 'next/router'

import { Header, Page } from '@bacondotbuild/ui'

import Meta from '@/components/meta'

const DEFAULT_TITLE = 'knex'

const Layout = ({
  title = DEFAULT_TITLE,
  children,
}: {
  title?: string
  children: React.ReactNode
}) => {
  const { pathname } = useRouter()
  return (
    <Page>
      <Meta
        title={title === DEFAULT_TITLE ? title : `${title} - ${DEFAULT_TITLE}`}
      />
      {/* <Header>
        {pathname === '/' ? (
          <span>{DEFAULT_TITLE}</span>
        ) : (
          <Link href='/' className='hover:text-cb-pink'>
            {DEFAULT_TITLE}
          </Link>
        )}
      </Header>
      <nav>
        <ul className='flex justify-center space-x-4'>
          <li>
            <Link className='text-cb-pink hover:underline' href='/about'>
              about
            </Link>
          </li>
          <li>
            <Link className='text-cb-pink hover:underline' href='/contact'>
              contact
            </Link>
          </li>
        </ul>
      </nav> */}
      {children}
    </Page>
  )
}

export default Layout

 import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Nav } from './components/ui/Nav';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

 export default function RootLayout(props: any) {
   const { children } = props;
   return (
     <html lang="en">
      <body className={roboto.variable}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
           <ThemeProvider theme={theme}>
            <Nav />
            {children}
           </ThemeProvider>
          </AppRouterCacheProvider>
       </body>
     </html>
   );
 }

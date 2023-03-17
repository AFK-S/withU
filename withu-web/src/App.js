import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Auth from './pages/auth/Auth'
import MainScreens from './pages/MainScreen/MainScreens'
import { useLocalSineProvider, ColorSchemeProvider, Paper } from '@mantine/core'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies] = useCookies(['user_id'])
  const [isLogin, setIsLogin] = useState(true)
  const [colorScheme, setColorScheme] = useLocalStorage(
    'mantine-color-scheme',
    {
      defaultValue: 'light',
      getInitialValueInEffect: true,
    },
  )

  useEffect(() => {
    setIsLogin(cookies.user_id ? true : false)
  }, [isLogin, cookies.user_id])

  const toggleColorScheme = () => {
    console.log(colorScheme)
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
  }
  return (
    <div className="App">
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }}>
          <Paper padding="xl" shadow="md">
            <BrowserRouter>
              {isLogin ? (
                <MainScreens setIsLogin={setIsLogin} />
              ) : (
                <Auth setIsLogin={setIsLogin} />
              )}
            </BrowserRouter>
          </Paper>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  )
}

export default App

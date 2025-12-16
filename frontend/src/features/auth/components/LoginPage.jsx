import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { getUserRole } from '../../../lib/auth.js'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()
  const { mutate: login, isPending: isLoggingIn } = loginMutation
  const navigate = useNavigate()
  const location = useLocation()

  // Get return URL from location state or localStorage
  const returnTo = location.state?.returnTo || localStorage.getItem('intendedBookingUrl') || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    login(
      { username, password },
      {
        onSuccess: async () => {
          toast.success('Đăng nhập thành công')

          // Check user role to determine redirect destination
          const role = await getUserRole()

          if (role === 'ADMIN') {
            // Admin user - redirect to admin panel or intended admin URL
            const intendedAdminUrl = localStorage.getItem('intendedAdminUrl')
            if (intendedAdminUrl) {
              localStorage.removeItem('intendedAdminUrl')
              navigate(intendedAdminUrl, { replace: true })
            } else {
              navigate('/admin', { replace: true })
            }
          } else {
            // Regular user - redirect to intended destination or home
            localStorage.removeItem('intendedBookingUrl')
            navigate(returnTo, { replace: true })
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Đăng nhập thất bại')
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          {location.state?.message && (
            <p className="mt-2 text-center text-sm text-blue-600">
              {location.state.message}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Đăng ký ngay
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useEffect } from "react";
import { RoutesConfig } from "./routes";
import { Navigation } from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./helpers/context/AuthContext";

export const App = () => {
  const { login, isLoading, user } = useAuth();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      if (tg.isVersionAtLeast("8.0")) {
        tg.requestFullscreen();
        tg.setHeaderColor("#000000");
      } else {
        tg.expand();
        console.log(
          "Bot API ниже 8.0, используется expand(). Текущая версия Telegram:",
          tg.version
        );
      }

      const initData = tg.initDataUnsafe;
      console.log("Telegram initData:", JSON.stringify(initData, null, 2));
      if (initData?.user) {
        console.log("User data extracted:", initData.user);
        login({
          telegramId: initData.user.id.toString(),
          name: initData.user.first_name || initData.user.username || "User",
          photoUrl: initData.user.photo_url || undefined,
        }).catch((error) => {
          console.error("Login error:", error.message);
        });
      } else {
        console.warn("User data not available in initData");
      }
    } else {
      console.warn("Telegram.WebApp is not available. Environment:", {
        windowLocation: window.location.href,
        userAgent: navigator.userAgent,
      });

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const tgWebAppData = params.get("tgWebAppData");
      if (tgWebAppData) {
        const decodedData = decodeURIComponent(tgWebAppData);
        const dataParams = new URLSearchParams(decodedData);
        const userParam = dataParams.get("user");
        const user = userParam
          ? JSON.parse(decodeURIComponent(userParam))
          : null;
        if (user) {
          console.log("Extracted user data from tgWebAppData:", user);
          login({
            telegramId: user.id.toString(),
            name: user.first_name || user.username || "User",
            photoUrl: user.photo_url || undefined,
          }).catch((error) => {
            console.error("Login error:", error.message);
          });
        } else {
          console.warn("No user data in tgWebAppData");
        }
      } else {
        console.log("tgWebAppData not found in URL, using hardcoded data");
        console.log("Calling login with hardcoded data");
        login({
          telegramId: "5666369",
          name: "Денис",
          photoUrl:
            "https://t.me/i/userpic/320/ArOpXH92rj_EpmqJ6uB_-vEugbCinOd3VU8tLlkf5DSxI8r40DuBCgyZH4VxImpQ.svg",
        })
          .then(() => {
            console.log("Login with hardcoded data succeeded");
          })
          .catch((error) => {
            console.error("Login error with hardcoded data:", error);
          });
        console.log("Finished calling login with hardcoded data");
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        Загрузка...
      </div>
    );
  }
  const isOnSubscriptionPage = window.location.pathname === "/subscription";


  if (!user?.isAdmin && !user?.isPremium && !isOnSubscriptionPage) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center p-6 space-y-4">
          <h1 className="text-2xl font-bold text-blue-900">Доступ ограничен</h1>
          <p className="text-gray-600">
            Чтобы получить доступ к возможностям ИИ-нутрициолога, купите ежовик на Wildberries
            или оформите месячную подписку.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.wildberries.ru/" // ← Укажите актуальную ссылку
              className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Купить ежовик
            </a>
            <a
              href="/subscription"
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Купить подписку (199 ₽ / месяц)
            </a>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation />
      <div className="max-w-5xl mx-auto p-4">
        <RoutesConfig />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

// import { useEffect } from 'react'
// import { RoutesConfig } from './routes'
// import { Navigation } from './components/Navigation'
// import { ToastContainer } from 'react-toastify'
// import { useAuth } from './helpers/context/AuthContext'

// export const App = () => {
// 	const { login, isLoading } = useAuth()

// 	useEffect(() => {
// 		const tg = window.Telegram?.WebApp

// 		if (tg) {
// 			tg.ready()
// 			if (tg.isVersionAtLeast('8.0')) {
// 				tg.requestFullscreen()
// 				tg.setHeaderColor('#000000')
// 			} else {
// 				tg.expand()
// 				console.log(
// 					'Bot API ниже 8.0, используется expand(). Текущая версия Telegram:',
// 					tg.version
// 				)
// 			}

// 			const initData = tg.initDataUnsafe
// 			if (initData?.user) {
// 				console.log('Данные пользователя:', initData.user)
// 				login({
// 					telegramId: initData.user.id.toString(),
// 					name: initData.user.first_name || initData.user.username || 'User',
// 					photoUrl: initData.user.photo_url || undefined,
// 				})
// 			} else {
// 				console.log('User data not available in initData')
// 			}
// 		} else {
// 			console.log('Telegram.WebApp не доступен. Окружение:', {
// 				windowLocation: window.location.href,
// 				userAgent: navigator.userAgent,
// 			})

// 			const hash = window.location.hash
// 			const params = new URLSearchParams(hash.replace('#', ''))
// 			const tgWebAppData = params.get('tgWebAppData')
// 			if (tgWebAppData) {
// 				const decodedData = decodeURIComponent(tgWebAppData)
// 				const dataParams = new URLSearchParams(decodedData)
// 				const userParam = dataParams.get('user')
// 				const user = userParam
// 					? JSON.parse(decodeURIComponent(userParam))
// 					: null
// 				if (user) {
// 					console.log('Извлечённые данные пользователя:', user)
// 					login({
// 						telegramId: user.id.toString(),
// 						name: user.first_name || user.username || 'User',
// 						photoUrl: user.photo_url || undefined,
// 					})
// 				}
// 			} else {
// 				console.log('tgWebAppData не найден в URL')
// 			}
// 		}
// 	}, [])

// 	if (isLoading) {
// 		return (
// 			<div className='min-h-screen bg-blue-50 flex items-center justify-center'>
// 				Загрузка...
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className='min-h-screen bg-blue-50'>
// 			<Navigation />
// 			<div className='max-w-5xl mx-auto p-4'>
// 				<RoutesConfig />
// 			</div>
// 			<ToastContainer />
// 		</div>
// 	)
// }

// export default App

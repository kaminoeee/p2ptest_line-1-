"use client";
import { useState } from "react";
// 変更点: @/ を使わず相対パスに修正
import { auth, db } from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  auth.onAuthStateChanged((currentUser) => {
    setUser(currentUser);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        await setDoc(doc(db, "users", newUser.uid), {
          uid: newUser.uid,
          email: email,
          username: username || email.split("@")[0],
          createdAt: new Date(),
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">💬 LINE風アプリへようこそ！</h1>
          <p className="text-gray-600 mb-6">ログイン中: <span className="font-semibold">{user.email}</span></p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-500">
            ここに「友達追加」「チャット」「P2P通話」の機能を追加していきます！
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            ログアウト
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLoginMode ? "ログイン" : "アカウント作成"}
        </h1>

        {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ユーザーID（表示名）</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="例: taro_123"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required={!isLoginMode}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            {isLoginMode ? "ログインする" : "登録する"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-green-600 hover:underline"
          >
            {isLoginMode ? "アカウントをお持ちでない方は新規登録" : "すでにアカウントをお持ちの方はログイン"}
          </button>
        </div>
      </div>
    </main>
  );
}

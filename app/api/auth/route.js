import { NextResponse } from 'next/server';

// 簡易的なメモリ上のデータ保存（※サーバーレスなのでインスタンスがリセットされると消えますが、テストには最適です）
let users = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, username } = body;

    if (action === 'register') {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return NextResponse.json({ status: 'error', message: 'すでに登録されているメールアドレスです' }, { status: 400 });
      }
      const newUser = { email, password, username: username || email.split('@')[0] };
      users.push(newUser);
      return NextResponse.json({ status: 'success', user: newUser });
    }

    if (action === 'login') {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return NextResponse.json({ status: 'error', message: 'メールアドレスまたはパスワードが間違っています' }, { status: 400 });
      }
      return NextResponse.json({ status: 'success', user });
    }

    return NextResponse.json({ status: 'error', message: '無効なアクションです' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

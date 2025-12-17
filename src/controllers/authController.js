import * as authService from "../services/authService.js";

export const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body)

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,      // ✅ Inaccessible au JavaScript
      secure: false,        // ✅ HTTPS uniquement
      sameSite: 'strict',  // ✅ Protection CSRF
      maxAge: 15 * 60 * 1000, // 15 minutes,
      domain: 'localhost',
    })

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours,
      domain: 'localhost',
    })

    res.json({ message: 'Login successful' })
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body?.refreshToken;
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const tokens = await authService.refreshToken(token);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    })

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.json({ message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(
      req.token,
      req.body?.refreshToken,
      req.user.id,
      req.user.exp
    );

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json(result);
  } catch (err) {
    next(err);
  }
};

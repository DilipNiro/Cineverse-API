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
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    res.json(tokens);
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
    res.json(result);
  } catch (err) {
    next(err);
  }
};

import { RequestHandler } from "express"
import * as userService from "../service/user.service"

export const createUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const dto = req.body
    const user = await userService.createUser(dto)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export const getAllUsers: RequestHandler = async (
  _req,
  res,
  next
): Promise<void> => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (err) {
    next(err)
  }
}

export const getUserById: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return // exit early, but don't return the `res` object
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updateUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const deleteUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await userService.deleteUser(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    // 204 must not send any payload
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

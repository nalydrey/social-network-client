import { UserModel } from "./UserModel"

export interface MessageModel{
  readonly _id: string
  readonly createdId: string
  readonly user: UserModel
  readonly chat: string
  isRead: boolean
  text: string
  createdAt: Date | string
  updatedAt: Date | string
}

import { z, ZodType } from 'zod';

export type RegisterFormData = {
  userName: string;
  userHandle: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterUserSchema: ZodType<RegisterFormData> = z
  .object({
    userName: z
      .string()
      .min(3, { message: 'Username is too short' })
      .max(50, { message: 'Username must be between 3 and 50 characters' }),
    userHandle: z
      .string()
      .min(3, { message: 'User handle is too short' })
      .max(50, { message: 'User handle must be between 3 and 50 characters' }),
    email: z
      .string()
      .email()
      .max(100, { message: 'Email cannot exceed 100 characters' }),
    password: z
      .string()
      .min(6, { message: 'Password is too short' })
      .max(100, { message: 'Password must be between 6 and 100 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = {
  email: string;
  password: string;
};

export const LoginUserSchema: ZodType<LoginFormData> = z.object({
  email: z
    .string()
    .email()
    .max(100, { message: 'Email cannot exceed 100 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password is too short' })
    .max(100, { message: 'Password must be between 6 and 100 characters' }),
});

export type CreateOrLoginUserResponse = {
  token: string;
};

export type UserSearch = {
  id: number;
  userName: string;
  userHandle: string;
  userAvatar?: string | null;
  about?: string | null;
  isFollowedByLoggedInUser: boolean;
};

type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userHandle: string;
  email: string;
  password: string;
  about: string | null;
  userAvatar?: string | null;
  userImage?: string | null;
};

export type UserPublic = Omit<User, 'email' | 'password' | 'updatedAt'> & {
  _count: {
    userFollowers: number;
    userFollowing: number;
    posts: number;
  };
  isFollowedByLoggedInUser: boolean;
};

type Post = {
  id: number;
  text?: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  replyToPostId: number | null;
};

export type PostCount = {
  replies: number;
  likes: number;
  reposts: number;
};

export type PostAllData = Post & {
  replyToPost?: PostAllData | null;
  user: Omit<
    User,
    'email' | 'password' | 'createdAt' | 'updatedAt' | 'about' | 'userImage'
  >;
  _count: PostCount;
  isLikedByLoggedInUser: boolean;
  isRepostedByLoggedInUser: boolean;
  
};

export type DecodedUserToken = {
  id: number;
  userName: string;
  userHandle: string;
  email: string;
  about: string | null;
  userAvatar: string | null;
  userImage: string | null;
  createdAt: Date;
  iat: number;
  exp: number;
};

export type AuthContextType = {
  token: string | null;
  user: DecodedUserToken | null;
  setUser: React.Dispatch<React.SetStateAction<DecodedUserToken | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
};

export type RepostsAllData = {
  id: number;
  createdAt: Date;
  postId: number;
  userId: number;
  post: PostAllData;
  user: Omit<
    User,
    'email' | 'password' | 'createdAt' | 'updatedAt' | 'about' | 'userImage'
  >;
};

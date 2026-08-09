export type UserRole = 'user' | 'admin'
export type CommentStatus = 'visible' | 'hidden' | 'deleted'
export interface PublicUser { id: string; login: string; avatarUrl: string; role: UserRole }
export interface ArticleStats { slug: string; views: number; likes: number; liked: boolean }
export interface CommentDto { id: string; articleSlug: string; body: string; status: CommentStatus; author: PublicUser; parentId: string | null; createdAt: string; updatedAt: string }

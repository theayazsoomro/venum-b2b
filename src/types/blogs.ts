export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: Author;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export interface RelatedBlog {
  id: number;
  title: string;
  image: string;
  category: string;
  readTime: string;
}

export interface BlogCardProps {
  blog: Omit<Blog, 'content'>;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 模块六：平台管理后台 ============

@Entity("admin_users")
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 50 })
  real_name: string;

  @Column()
  role_id: number;

  @Column({ default: "active" })
  status: string;

  @Column({ nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: "simple-json", nullable: true })
  permissions: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("merchants")
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 50 })
  module: string;

  @Column({ length: 100 })
  shop_name: string;

  @Column({ length: 50 })
  contact_name: string;

  @Column({ length: 20 })
  contact_phone: string;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("merchant_applies")
export class MerchantApply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  shop_name: string;

  @Column({ length: 50 })
  module: string;

  @Column({ type: "simple-json", nullable: true })
  materials: string[];

  @Column({ default: "pending" })
  status: string;

  @Column({ nullable: true })
  reviewer_id: number;

  @Column({ type: "text", nullable: true })
  review_reason: string;

  @Column({ nullable: true })
  reviewed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("platform_notices")
export class PlatformNotice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ default: "published" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("banners")
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  link_url: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("system_messages")
export class SystemMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("operation_logs")
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operator_id: number;

  @Column({ length: 50 })
  action_type: string;

  @Column({ length: 100 })
  target: string;

  @Column({ type: "text", nullable: true })
  detail: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn()
  created_at: Date;
}

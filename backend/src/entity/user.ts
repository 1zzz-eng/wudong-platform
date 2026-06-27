import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  region: string;

  @Column({ length: 200, nullable: true })
  bio: string;

  @Column({ length: 50, nullable: true })
  openid: string;

  @Column({ default: false })
  is_merchant: boolean;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

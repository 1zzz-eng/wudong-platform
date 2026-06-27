import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 模块五：社区——照片分享模块 ============

@Entity("travel_notes")
export class TravelNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "simple-json", nullable: true })
  images: string[];

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  related_place: string;

  @Column({ length: 500, nullable: true })
  topic_tags: string;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: 0 })
  comment_count: number;

  @Column({ default: 0 })
  fav_count: number;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: "pending_review" })
  status: string;

  @Column({ nullable: true })
  review_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("note_comments")
export class NoteComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note_id: number;

  @Column()
  user_id: number;

  @Column({ type: "text" })
  content: string;

  @Column({ nullable: true })
  reply_to_id: number;

  @Column({ default: 0 })
  like_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("topics")
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: 0 })
  follower_count: number;

  @Column({ default: 0 })
  note_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("follow_relations")
export class FollowRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  follow_user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("like_records")
export class LikeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  target_type: string;

  @Column()
  target_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("report_records")
export class ReportRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reporter_id: number;

  @Column({ length: 50 })
  target_type: string;

  @Column()
  target_id: number;

  @Column({ type: "text" })
  reason: string;

  @Column({ default: "pending" })
  status: string;

  @Column({ type: "text", nullable: true })
  handle_result: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

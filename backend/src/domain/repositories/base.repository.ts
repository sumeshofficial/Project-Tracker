export interface BaseRepository<TEntity> {
  save(entity: TEntity): void;

  findById(userId: string, id: string): Promise<TEntity | null>;

  delete(userId: string, id: string): Promise<void>;
}

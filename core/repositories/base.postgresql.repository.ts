/* eslint-disable @typescript-eslint/ban-types */
import { DataSource, EntitySchema } from 'typeorm';
import { EUser } from './user/typeorm/user.entity';

export abstract class BasePostgreSQLRepository {
  /**
   * Main datasource that will be used
   */
  private static dataSource: DataSource;

  /**
   * Migrations files to be used
   */
  protected static migrations: Array<Function | string> = [];

  /**
   * Migrations files to be used
   */
  protected static entities: Array<Function | string | EntitySchema> = [EUser];

  /**
   * Indicates if schema sould be syncronized with entities or not
   */
  protected static synchronize = true;

  /**
   * Indicates if the queries should be logged or not for debugging
   */
  protected static logging = false;

  /**
   * Indicates if the Datasource is initialized or not
   */
  private static initialized = false;

  protected async init(): Promise<void> {
    if (BasePostgreSQLRepository.dataSource) {
      return;
    }

    BasePostgreSQLRepository.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST,
      port: parseInt(process.env.POSTGRESQL_PORT),
      username: process.env.POSTGRESQL_USERNAME,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE,
      entities: BasePostgreSQLRepository.entities,
      synchronize: BasePostgreSQLRepository.synchronize,
      logging: BasePostgreSQLRepository.logging,
      migrations: BasePostgreSQLRepository.migrations,
    });
    await BasePostgreSQLRepository.dataSource.initialize();
    await BasePostgreSQLRepository.dataSource.runMigrations();
    BasePostgreSQLRepository.initialized = true;
  }

  protected dataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('Data source not ready yet!');
    }

    return BasePostgreSQLRepository.dataSource;
  }

  public static isInitialized(): boolean {
    return BasePostgreSQLRepository.initialized;
  }

  public static async destroyDatasource() {
    await BasePostgreSQLRepository.dataSource.destroy();
    BasePostgreSQLRepository.dataSource = null;
    BasePostgreSQLRepository.initialized = false;
  }
}

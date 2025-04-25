let dbInstance: IDBDatabase | null = null;

const DB_NAME = 'playNineScores';

export const openDB = (): Promise<IDBDatabase> => {
  if ( dbInstance ) {
    return Promise.resolve( dbInstance );
  }

  return new Promise( ( resolve, reject ) => {
    const request = indexedDB.open( DB_NAME, 1 );

    request.onupgradeneeded = ( event: IDBVersionChangeEvent ) => {
      const db = ( event.target as IDBOpenDBRequest ).result;
      if ( !db.objectStoreNames.contains( 'players' ) ) {
        db.createObjectStore( 'players', { autoIncrement: true } );
      }
    };

    request.onsuccess = ( event: Event ) => {
      dbInstance = ( event.target as IDBOpenDBRequest ).result;

      dbInstance.onversionchange = () => {
        console.log( 'Database version change detected. Closing connection.' );
        dbInstance?.close();
        dbInstance = null;
      };

      resolve( dbInstance );
    };

    request.onerror = ( event: Event ) => {
      reject( ( event.target as IDBOpenDBRequest ).error );
    };
  } );
};

export const closeDB = (): void => {
  if ( dbInstance ) {
    dbInstance.close();
    dbInstance = null;
  }
};
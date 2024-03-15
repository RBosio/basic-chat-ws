import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SocketIoModule } from 'ngx-socket-io';
import { setId } from './setId';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      SocketIoModule.forRoot({
        url: 'https://chat-ws-e7wn.onrender.com',
        options: {
          withCredentials: true,
          query: {
            id: setId(),
          },
        },
      })
    ),
  ],
};

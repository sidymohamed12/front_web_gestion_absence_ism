import { CanMatchFn } from '@angular/router';

export const roleMatchGuard: CanMatchFn = (route, segments) => {
  return true;
};

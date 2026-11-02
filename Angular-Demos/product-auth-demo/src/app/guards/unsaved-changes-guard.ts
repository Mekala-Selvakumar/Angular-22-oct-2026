import { CanDeactivateFn } from '@angular/router';
import { CanDeactivateComponent } from './can-deactivate.interface';

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  if (component.hasUnsavedChanges()){
      return window.confirm(
        'You have unsaved changes. Do you want to leave this page?'
      );
  }
  return true;
};

 
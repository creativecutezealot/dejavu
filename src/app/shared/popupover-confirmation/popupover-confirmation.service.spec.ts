import { TestBed } from '@angular/core/testing';

import { PopupoverConfirmationService } from './popupover-confirmation.service';

describe('PopupoverConfirmationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupoverConfirmationService = TestBed.get(PopupoverConfirmationService);
    expect(service).toBeTruthy();
  });
});

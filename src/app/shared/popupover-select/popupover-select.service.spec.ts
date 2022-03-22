import { TestBed } from '@angular/core/testing';

import { PopupoverSelectService } from './popupover-select.service';

describe('PopupoverSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupoverSelectService = TestBed.get(PopupoverSelectService);
    expect(service).toBeTruthy();
  });
});

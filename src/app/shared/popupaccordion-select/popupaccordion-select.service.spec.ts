import { TestBed } from '@angular/core/testing';

import { PopupaccordionSelectService } from './popupaccordion-select.service';

describe('PopupaccordionSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupaccordionSelectService = TestBed.get(PopupaccordionSelectService);
    expect(service).toBeTruthy();
  });
});

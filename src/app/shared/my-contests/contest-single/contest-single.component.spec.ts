import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestSingleComponent } from './contest-single.component';

describe('ContestSingleComponent', () => {
  let component: ContestSingleComponent;
  let fixture: ComponentFixture<ContestSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

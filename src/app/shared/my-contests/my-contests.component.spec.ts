import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContestsComponent } from './my-contests.component';

describe('MyContestsComponent', () => {
  let component: MyContestsComponent;
  let fixture: ComponentFixture<MyContestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

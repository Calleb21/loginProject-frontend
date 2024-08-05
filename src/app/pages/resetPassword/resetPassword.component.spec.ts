import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassWordComponent } from './resetPassword.component';

describe('LoginComponent', () => {
  let component: ResetPassWordComponent;
  let fixture: ComponentFixture<ResetPassWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassWordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeleteConfirmComponent } from './account-delete-confirm.component';

describe('AccountDeleteConfirmComponent', () => {
  let component: AccountDeleteConfirmComponent;
  let fixture: ComponentFixture<AccountDeleteConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDeleteConfirmComponent]
    });
    fixture = TestBed.createComponent(AccountDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

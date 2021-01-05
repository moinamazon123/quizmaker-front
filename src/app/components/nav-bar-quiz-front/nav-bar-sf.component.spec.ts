/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavBarComponentQuizFront } from './nav-bar-sf.component';

describe('NavBarComponent', () => {
  let component: NavBarComponentQuizFront;
  let fixture: ComponentFixture<NavBarComponentQuizFront>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBarComponentQuizFront ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponentQuizFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

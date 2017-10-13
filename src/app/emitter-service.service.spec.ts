/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmitterServiceService } from './emitter-service.service';

describe('EmitterServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmitterServiceService]
    });
  });

  it('should ...', inject([EmitterServiceService], (service: EmitterServiceService) => {
    expect(service).toBeTruthy();
  }));
});

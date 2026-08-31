import { JobQueue } from '../lib/domain/production/queue/job-queue.ts';
import { MockDevImageProvider } from '../lib/domain/production/providers/dev-mock-provider.ts';
import { PromptEngine } from '../lib/domain/production/engine/prompt-engine.ts';
import fs from 'fs';

async function testSingleJob() {
  const mock = new MockDevImageProvider();
  const identity = {
    face_description: 'Test face',
    hair_description: 'Test hair',
    skin_description: 'Test skin',
    body_description: 'Test body',
    apparent_age: 'Adult',
    distinctive_features: [],
    source_image_reference: 'https://images.unsplash.com/photo-1544126592-807ade215a0b',
  };

  const shootPlan = PromptEngine.buildShootPlan('aniversario', 'celebration-glam', 6);
  const variation = shootPlan.variations[0];

  const job = {
    id: 'test-job-1',
    session_id: 'test-session-1',
    photo_index: 1,
    status: 'QUEUED',
    variation,
    attempts: 0,
    max_attempts: 3,
    versions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('Processing job with mock provider...');
  const result = await JobQueue.processPhotoJob({
    sessionId: 'test-session-1',
    sourceImageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b',
    identityProfile: identity,
    categorySlug: 'aniversario',
    styleSlug: 'celebration-glam',
    job,
    generationProvider: mock,
    upscaleProvider: mock,
  });

  console.log('JOB RESULT STATUS:', result.status);
  console.log('JOB ACTIVE VERSION:', result.active_version);
}

testSingleJob();

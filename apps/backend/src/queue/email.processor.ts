import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ResendService } from '../integrations/resend/resend.service';
import { EMAIL_QUEUE, EmailJob } from './queue.constants';

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly resendService: ResendService) {
    super();
  }

  async process(job: Job<EmailJobData, void, EmailJob>): Promise<void> {
    this.logger.log(`Processing email job "${job.name}" -> ${job.data.to}`);
    await this.resendService.sendEmail(job.data);
  }
}

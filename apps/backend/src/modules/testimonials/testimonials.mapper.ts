import { Testimonial as TestimonialDto } from '@bayan/shared';
import { Testimonial as TestimonialEntity } from '@prisma/client';

export function toTestimonialDto(testimonial: TestimonialEntity): TestimonialDto {
  return {
    id: testimonial.id,
    siteId: testimonial.siteId,
    authorName: testimonial.authorName,
    rating: testimonial.rating,
    content: testimonial.content,
    avatar: testimonial.avatar,
    isApproved: testimonial.isApproved,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString(),
  };
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogPost } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@ApiTags('blog')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @Post('sites/:siteId/blog')
  @ApiOperation({ summary: 'Create a blog post' })
  create(
    @CurrentClient() client: AuthenticatedClient,
    @Param('siteId') siteId: string,
    @Body() dto: CreateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogService.create(siteId, client.id, dto);
  }

  @Public()
  @Get('sites/:siteId/blog')
  @ApiOperation({ summary: 'List published blog posts for a site (live site)' })
  findPublished(@Param('siteId') siteId: string): Promise<BlogPost[]> {
    return this.blogService.findPublishedForSite(siteId);
  }

  @ApiBearerAuth()
  @Get('sites/:siteId/blog/admin')
  @ApiOperation({ summary: 'List all blog posts (drafts included) for the site owner' })
  findAll(@CurrentClient() client: AuthenticatedClient, @Param('siteId') siteId: string): Promise<BlogPost[]> {
    return this.blogService.findAllForSite(siteId, client.id);
  }

  @ApiBearerAuth()
  @Patch('blog/:id')
  @ApiOperation({ summary: 'Update a blog post' })
  update(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogService.update(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('blog/:id')
  @ApiOperation({ summary: 'Delete a blog post' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.blogService.remove(id, client.id);
  }
}

import { categoryCreate, categoryUpdate } from '@/libs/prisma/category.args';
import { imageCreate, imageUpdate } from '@/libs/prisma/images.args';
import prisma from '@/prisma';
import { BadRequestError, catchAllErrors, InternalServerError } from '@/utils/error';
import { countTotalPage, paginate } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { log } from 'handlebars';
import { z, ZodError } from 'zod';

class CategoryService {
  // TODO: Buat Categories ajah suruh nopal
  async getCat(req: Request) {
    return await prisma.category.findMany({ where: { is_deleted: false }, include: { image: { select: { name: true } } } });
  }

  async getCategories(req: Request) {
    const { page_tab1, search_tab1, sort_by_tab1, sort_dir_tab1 } = req.query;
    const show = 10;
    try {
      const where: Prisma.CategoryWhereInput = { is_deleted: false };
      if (search_tab1) where.AND = { OR: [{ name: { contains: String(search_tab1) } }] };
      let queries: Prisma.CategoryFindManyArgs = {
        where,
        orderBy: { name: 'asc' },
        include: { image: { select: { name: true } }, sub_categories: true, product: true },
      };
      if (sort_by_tab1 && sort_dir_tab1) queries.orderBy = { [`${sort_by_tab1}`]: sort_dir_tab1 };
      if (page_tab1) queries = { ...queries, ...paginate(show, Number(page_tab1)) };
      const categories = await prisma.category.findMany(queries);
      if (!categories) throw new InternalServerError('Unable to fetch data.');
      const count = await prisma.category.count({ where });
      return page_tab1 ? { categories, totalPages: countTotalPage(count, show) } : categories;
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async getSubCategories(req: Request) {
    const { page_tab2, search_tab2, sort_by_tab2, sort_dir_tab2 } = req.query;
    const show = 10;
    try {
      const where: Prisma.SubCategoryWhereInput = { is_deleted: false };
      if (search_tab2) where.AND = { OR: [{ name: { contains: String(search_tab2) } }, { category: { name: { contains: String(search_tab2) } } }] };
      let queries: Prisma.SubCategoryFindManyArgs = {
        where,
        orderBy: { name: 'asc' },
        include: { category: true },
      };
      if (sort_by_tab2 && sort_dir_tab2) queries.orderBy = { [`${sort_by_tab2}`]: sort_dir_tab2 };
      if (page_tab2) queries = { ...queries, ...paginate(show, Number(page_tab2)) };
      const subCategories = await prisma.subCategory.findMany(queries);
      if (!subCategories) throw new InternalServerError('Unable to fetch data.');
      const count = await prisma.subCategory.count({ where });
      return page_tab2 ? { subCategories, totalPages: countTotalPage(count, show) } : subCategories;
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async getSubCategoriesByCatID(req: Request) {
    try {
      let where: Prisma.CategoryWhereInput = { is_deleted: false };
      if (req.query.category_id) where.AND = { id: Number(req.query.category_id) };
      if (req.query.category_name) where.AND = { name: { equals: String(req.query.category_name) } };
      const data = await prisma.category.findFirst({
        where,
        include: { sub_categories: true },
      });
      return data;
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async getCategoryNames(req: Request) {
    const { search } = req.query;
    const queries: Prisma.CategoryFindManyArgs = {
      select: { name: true, id: true },
    };
    if (search) queries.where = { name: { contains: String(search) } };
    try {
      const categories = await prisma.category.findMany(queries);
      return categories;
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async createCategory(req: Request) {
    try {
      const schema = z.string().min(4);
      const validate = schema.safeParse(req.body.name);
      if (!validate.success) throw new ZodError(validate.error.errors);
      const { file } = req;
      if (file && validate.success) {
        await prisma.$transaction(async (prisma) => {
          const image = await prisma.image.create(await imageCreate(req, 'category'));
          await prisma.category.create(categoryCreate(req, image.id));
        });
      } else {
        throw new BadRequestError('Image is required.');
      }
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async updateCategory(req: Request) {
    try {
      const schema = z.string().min(4).optional();
      const validate = schema.safeParse(req.body.name);
      if (!validate.success) throw new ZodError(validate.error.errors);
      await prisma.$transaction(async (prisma) => {
        const { image_id } = await prisma.category.update(categoryUpdate(req));
        if (req.file) {
          await prisma.image.update(await imageUpdate(req, image_id || ''));
        }
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async createSubCategory(req: Request) {
    try {
      const { name, category_id } = req.body;
      const schema = z.string().min(4);
      const validate = schema.safeParse(req.body.name);
      if (!validate.success) throw new ZodError(validate.error.errors);
      await prisma.subCategory.create({
        data: { name, category_id: Number(category_id) },
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async updateSubCategory(req: Request) {
    try {
      const { name, category_id } = req.body;
      const schema = z.string().min(4).optional();
      const validate = schema.safeParse(req.body.name);
      if (!validate.success) throw new ZodError(validate.error.errors);
      await prisma.subCategory.update({
        where: { id: Number(req.params.id) },
        data: { name, category_id },
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async deleteCategory(req: Request) {
    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.subCategory.deleteMany({
          where: { category_id: Number(req.params.id) },
        });
        await prisma.category.update({
          where: { id: Number(req.params.id) },
          data: { is_deleted: true },
        });
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async deleteSubCategory(req: Request) {
    try {
      await prisma.subCategory.update({
        where: { id: Number(req.params.id) },
        data: { is_deleted: true },
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
}

export default new CategoryService();

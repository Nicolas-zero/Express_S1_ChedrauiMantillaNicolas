import Joi from 'joi';

export const studentSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid('inscrito', 'cursando', 'aprobado', 'reprobado', 'retirado').default('inscrito'),
  module: Joi.string().allow('', null),
  grades: Joi.object({
    project: Joi.number().min(0).max(5).default(0),
    work: Joi.number().min(0).max(5).default(0),
    quizzes: Joi.number().min(0).max(5).default(0),
    exam: Joi.number().min(0).max(5).default(0)
  }).default({})
});

export const trainerSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  specialty: Joi.string().allow('', null)
});

export const moduleSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('', null)
});

export const classroomSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().min(1).required(),
  capacity: Joi.number().integer().min(1).default(30)
});

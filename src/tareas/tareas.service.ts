import { BadRequestException, Injectable } from '@nestjs/common';
import { TareaInterface } from './entity/tarea.interface';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entity/tarea.entity';

@Injectable()
export class TareasService {
  // HERRAMIENTAS
  constructor(
    @InjectRepository(Tarea)
    private tareaRepository: Repository<Tarea>,
  ) {}
  // private entityManager = getManager();
  // FIN DE HERRAMIENTAS
  public async getTareas() {
    //return tareas;
    return await this.tareaRepository
      .createQueryBuilder('tarea')
      .select()
      .getMany();
  }

  public async getTarea(id_tarea) {
    return await this.tareaRepository.findOne({
      where: {
        id: id_tarea,
      },
    });
    //return tareas.find((tarea) => tarea.id === id);
  }

  public async insertTarea(body) {
    const crearTarea = new Tarea();
    crearTarea.nombre = body.nombre;
    crearTarea.tiempo = body.tiempo;
    crearTarea.finalizado = false;
    try {
      const tareaGuardada = await this.tareaRepository.save(crearTarea);
      return {
        statusCode: 200,
        msg: 'Se realizo la insercción correctamente',
      };
    } catch (error) {
      return new BadRequestException(error);
    }
    // tareas.push(body);
    // return {
    //   statusCode: 200,
    //   msg: 'Se realizo la insercción correctamente',
    //   data: tareas,
    // };
  }

  public async editTarea(id_tarea, body: Tarea) {
    try {
      const tareaAEditar = await this.tareaRepository.findOne({
        where: {
          id: id_tarea,
        },
      });
      tareaAEditar.nombre = body.nombre;
      tareaAEditar.tiempo = body.tiempo;
      tareaAEditar.finalizado = true;
      await this.tareaRepository.save(tareaAEditar);
      return {
        statusCode: 200,
        msg: 'Tarea editada correctamente.',
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  public async deleteTarea(id_tarea: number) {
    try {
      await this.tareaRepository.delete({
        id: id_tarea,
      });
      return {
        statusCode: 200,
        msg: 'Tarea eliminada.',
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}

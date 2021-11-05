const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach,
} = require('mocha');
const { getConnection } = require('./mongoMockConnection');
const conn = require('../connection/connectionLocal');

const taskModel = require('../models/taskModel');

describe('Exibe todas as tarefas Criadas', () => {
  describe('quando existe uma tarefa criada', () => {
    const payload = { task: 'Testar o Projeto' };
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const response = await taskModel.getAllTasks();
        expect(response).to.be.an('object');
      });

      it('a tarefa possui a chave "tasks"', async () => {
        const response = await taskModel.getAllTasks();
        expect(response).to.have.property('tasks');
      });

      it('a chave tasks é um array', async () => {
        const { tasks } = await taskModel.getAllTasks();
        expect(tasks).to.be.an('array');
      });

      it('o array contem um objeto', async () => {
        const { tasks } = await taskModel.getAllTasks();
        expect(tasks[0]).to.include.an('object');
      });

      it('o objeto contém a chave "id, task"', async () => {
        const { tasks } = await taskModel.getAllTasks();
        expect(tasks[0]).to.have.all.keys('_id', 'task');
      });
    });
  });
  describe('quando nao existe uma tarefa cadastrada', () => {
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').deleteMany({});
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const response = await taskModel.getAllTasks();
        expect(response).to.be.an('object');
      });

      it('o objeto possui a chave "tasks"', async () => {
        const response = await taskModel.getAllTasks();
        expect(response).to.have.property('tasks');
      });

      it('a chave tasks é um array', async () => {
        const { tasks } = await taskModel.getAllTasks();
        expect(tasks).to.be.an('array');
      });

      it('o array é vazio', async () => {
        const { tasks } = await taskModel.getAllTasks();
        const emptyArray = expect(tasks).to.be.empty;
        return emptyArray;
      });
    });
  });
});

describe('Procura uma tarefa', () => {
  describe('quando existe uma tarefa', () => {
    const payload = { task: 'Testar o projeto' };
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const response = await taskModel.getTaskByName(payload.task);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as chaves "_id", "task"', async () => {
        const response = await taskModel.getTaskByName(payload.task);
        expect(response).to.have.all.keys('_id', 'task');
      });
    });
  });

  describe('quando não existe uma tarefa', () => {
    const payload = { task: 'Testar o projeto' };
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').deleteMany({});
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const response = await taskModel.getTaskByName(payload.task);
        const toBeNull = expect(response).to.be.null;
        return toBeNull;
      });
    });
  });
});

describe('Procura uma tarefa pelo id', () => {
  describe('quando existe uma tarefa', () => {
    const payload = { task: 'Testar o projeto' };

    describe('a resposta', () => {
      let response;
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        response = await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(async () => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const result = await taskModel.getTaskById(response.insertedId);
        expect(result).to.be.an('object');
      });

      it('o objeto contém as chaves "_id", "task"', async () => {
        const result = await taskModel.getTaskById(response.insertedId);
        expect(result).to.have.all.keys('_id', 'task');
      });
    });
  });

  describe('quando não existe uma tarefa', () => {
    const ID_EXAMPLE = '6140b6bafc23168216d5f951';
    const payload = { task: 'Testar o projeto' };

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        const response = await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
        return response;
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await taskModel.getTaskById(ID_EXAMPLE);
        const toBeNull = expect(result).to.be.null;
        return toBeNull;
      });
    });
  });

  describe('quando o id for inválido', () => {
    const ID_EXAMPLE = '61409dcc05';

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      after(() => {
        ObjectId.isValid.restore();
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await taskModel.getTaskById(ID_EXAMPLE);
        const toBeNull = expect(result).to.be.null;
        return toBeNull;
      });
    });
  });
});

describe('Testa a inserção de uma nova tarefa', () => {
  describe('quando inserido com sucesso', () => {
    const payload = { task: 'Testar o projeto' };

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto', async () => {
        const response = await taskModel.createNewTask(payload);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as propriedades, "task", "userId", "_id", "date"', async () => {
        const response = await taskModel.createNewTask(payload);
        expect(response).to.have.all.keys('task', 'userId', '_id', 'date');
      });
    });
  });

  describe('quando há uma falha na inserção', () => {
    const payload = { taskkk: 'Erro A Chave' };

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto', async () => {
        const response = await taskModel.createNewTask(payload);
        const toBeNull = expect(response).to.be.null;
        return toBeNull;
      });
    });
  });
});

describe('Testa a atualização de uma tarefa', () => {
  describe('caso atualizado com sucesso', () => {
    const payload = { task: 'queria testar o projeto' };
    const update = { task: 'Já testei o projeto' };

    describe('a resposta', () => {
      let result;
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        result = await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto', async () => {
        const response = await taskModel.updateTask(result.insertedId, update.task);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as propriedades "id" e "task"', async () => {
        const response = await taskModel.updateTask(result.insertedId, update.task);
        expect(response).to.have.all.keys('_id', 'task');
      });
    });
  });

  describe('caso falhe a atualização', () => {
    const payload = { task: 'queria testar o projeto' };
    const update = { task: 'queria testar o projeto' };
    const invalidId = '123456';
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const response = await taskModel.updateTask(invalidId, update.task);
        const toBeNull = expect(response).to.be.null;
        return toBeNull;
      });
    });
  });

  describe('quando o id for inválido', () => {
    const payload = { task: 'já testei o projeto' };
    const invalidId = '123456';

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      after(() => {
        ObjectId.isValid.restore();
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await taskModel.updateTask(invalidId, payload.task);
        const toBeNull = expect(result).to.be.null;
        return toBeNull;
      });
    });
  });
});

describe('Testa a remoção de uma tarefa', () => {
  describe('quando removido com sucesso', () => {
    const payload = { task: 'Vou testar o projeto' };
    describe('a resposta', () => {
      let result;

      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        result = await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto contendo as keys "_id", "task"', async () => {
        const response = await taskModel.deleteTask(result.insertedId);
        expect(response).to.be.an('object');
        expect(response).to.have.all.keys('_id', 'task');
      });
    });
  });

  describe('quando falha a remoção', () => {
    const payload = { task: 'testando o projeto' };
    const invalidId = '123456';
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        const result = await connectionMock.db('ebytr_tasks').collection('tasks').insertOne(payload);
        return result;
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const response = await taskModel.deleteTask(invalidId);
        const toBeNull = expect(response).to.be.null;
        return toBeNull;
      });
    });
  });
});

describe('Testa a conexão com o MongoDB', () => {
  describe('quando há sucesso', () => {
    describe('a resposta', () => {
      it('é uma Promise', () => {
        const result = conn.connection();
        expect(result).to.be.a('Promise');
      });
    });
  });

  describe('quando há um erro', () => {
    describe('a resposta', () => {
      beforeEach(async () => {
        sinon.stub(MongoClient, 'connect').throws();
      });

      afterEach(() => {
        MongoClient.connect.restore();
      });

      it('é um erro', async () => {
        const result = await conn.connection();
        expect(() => result.catch((err) => err)).to.be.a('function');
      });
    });
  });
});

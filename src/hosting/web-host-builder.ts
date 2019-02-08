import { Startup } from './startup';
import path = require('path');
import fs = require('fs');
import { Container, injectable } from 'inversify';
import { ApplicationContext } from './application-context';
import express = require('express');
import { WebHost } from './web-host';
import { LoggerFactory } from '../logging';
import bodyParser = require('body-parser');
import { EXPRESS_SYMBOL, APP_SETTINGS_SYMBOL } from './symbols';
import { ControllerCollectionRouter } from '../routing';

/** Builds the web host */
export class WebHostBuilder {
  private appSettings: any;
  private container: Container;
  private express: express.Express;
  private loggerFactory = new LoggerFactory();
  private expressLogger = this.loggerFactory.createLogger('Express');
  private startupConstructor: new (context: ApplicationContext) => Startup;

  /**
   * Adds application settings.
   * @param fileName The file name of the application's settings.
   */
  addAppSettings(fileName: string = './app.settings.json') {
    const settings = fs.readFileSync(path.resolve(fileName)).toString();
    this.appSettings = JSON.parse(settings);
    return this;
  }

  /**
   * Tells the builder to use this startup.
   * @param startupConstructor The application's startup.
   */
  useStartup(startupConstructor: new (context: ApplicationContext) => Startup) {
    this.startupConstructor = startupConstructor;
    return this;
  }

  /** Builds the WebHost. */
  async build() {
    this.setupContainer();
    this.setupExpress();
    const context: ApplicationContext = {
      appSettings: this.appSettings,
      container: this.container,
      express: this.express,
      controllers: [],
      filters: [],
      loggerFactory: this.loggerFactory
    };

    const startup = new this.startupConstructor(context);
    await Promise.resolve(startup.configure());

    for (const controller of context.controllers) {
      injectable()(controller);
    }

    this.configureExpress(context);

    this.container.bind(APP_SETTINGS_SYMBOL).toConstantValue(context.appSettings);
    this.container.bind(LoggerFactory).toConstantValue(context.loggerFactory);

    return new WebHost(context);
  }

  private setupContainer() {
    this.container = new Container({
      skipBaseClassChecks: true
    });
  }

  private setupExpress() {
    this.express = express();
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use((req, res, next) => {
      this.expressLogger.info(`Request: ${req.method.toUpperCase()} ${req.path}`);
      next();
    });
    this.container.bind(EXPRESS_SYMBOL).toConstantValue(this.express);
  }

  private configureExpress(context: ApplicationContext) {
    const controllersRouter = new ControllerCollectionRouter(context);
    context.express.use(controllersRouter.route());
    context.express.use((req, res) => {
      this.expressLogger.info(`404`);
      return res.status(404).send();
    });
  }
}

# mvc

**mvc** provides an very simplified MVC framework similar to that of .NET Core MVC.

## Index

Installation

## Installation

`npm install --save @wtprograms/mvc`

## Usage

```typescript
import {
  WebHostBuilder,
  DEFAULT_COLOR_MAPS,
  ConsoleLoggerProvider,
  FileLoggerProvider,
  IStartup,
  ControllerRoute,
  HttpGet,
  HttpPost,
  Model,
  HttpDelete
} from '@wtprograms/mvc';

@ControllerRoute('/values')
class ValuesController {
  @HttpGet()
  get() {
    return ['value1', 'value2'];
  }

  @HttpGet('/:id')
  getSingle(id: number) {
    return 'value';
  }

  @HttpPost()
  post(@Model() value: string) {}

  @HttpDelete('/:id')
  delete(id: number) {}
}

class Startup implements IStartup {
  configure(context: ApplicationContext) {
    context.loggerFactory.loggingLevel = LogLevel.debug;
    context.loggerFactory.providers.push(
      new ConsoleLoggerProvider(DEFAULT_COLOR_MAPS)
      new FileLoggerProvider('./app.log'));

    context.controllers.push(ValuesController);
  }
}

new WebHostBuilder()
  .useStartup(Startup)
  .build()
  .run(5000);

```

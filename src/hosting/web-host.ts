import { ApplicationContext } from './application-context';

/** Hosts the web application. */
export class WebHost {
  /**
   * Initializes the web host.
   * @param applicationContext The application's context.
   */
  constructor(private applicationContext: ApplicationContext) {}

  /**
   * Runs the web host.
   * @param port The port number to host the web application on.
   */
  run(port: number) {
    this.applicationContext.express.listen(port, () => {
      console.log(`Now listening on port: ${port}`);
    });
  }
}

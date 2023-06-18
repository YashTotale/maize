type AsyncFC<P = {}> = AsyncFunctionComponent<P>;

interface AsyncFunctionComponent<P = {}> {
  (props: P, context?: any): Promise<ReactElement<any, any>> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

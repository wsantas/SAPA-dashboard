import { Component, type ErrorInfo, type ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

type Props = {
  readonly children: ReactNode
  /** Human label shown in the fallback UI. */
  readonly label?: string
}

type State = {
  readonly error: Error | null
}

/**
 * Catches render and lifecycle errors in the subtree and renders a fallback
 * panel instead of crashing the entire app. Must be a class component —
 * React 19 still has no functional equivalent for error boundaries.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      `[ErrorBoundary${this.props.label ? ' ' + this.props.label : ''}]`,
      error,
      info.componentStack,
    )
  }

  private reset = (): void => {
    this.setState({ error: null })
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <section className={styles.fallback} role="alert">
          <span className={styles.icon}>⚠</span>
          <div className={styles.body}>
            <h3 className={styles.heading}>
              {this.props.label ?? 'Widget'} crashed
            </h3>
            <p className={styles.message}>{this.state.error.message}</p>
            <button
              type="button"
              className={styles.retry}
              onClick={this.reset}
            >
              Retry
            </button>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}

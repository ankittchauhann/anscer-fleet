import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monitor/robotRequest')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/monitor/robotRequest"!</div>
}

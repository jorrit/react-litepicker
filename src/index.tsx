// @ts-ignore
// eslint-disable-next-line no-unused-vars
import LitePicker from 'litepicker'
// @ts-ignore
import NoCssLitePicker from 'litepicker/dist/js/main.nocss'
import * as React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom'

export type DateExp = Date | number | String
export type DateRange = [DateExp, DateExp]
export type DateOrRangeArray = Array<DateRange | DateExp>

export interface LitePickerProps {
  rootElement?: React.ForwardRefExoticComponent<any>
  endRootElement?: React.ForwardRefExoticComponent<any>
  firstDay?: number
  format?: string
  lang?: string
  numberOfMonths?: number
  numberOfColumns?: number
  minDate?: DateExp
  maxDate?: DateExp
  minDays?: number
  maxDays?: number
  selectForward?: boolean
  splitView?: boolean
  inlineMode?: boolean
  singleMode?: boolean
  autoApply?: boolean
  allowRepick?: boolean
  showWeekNumbers?: boolean
  showTooltip?: boolean
  hotelMode?: boolean
  disableWeekends?: boolean
  scrollToDate?: boolean
  mobileFriendly?: boolean
  useResetBtn?: boolean
  autoRefresh?: boolean
  moveByOneMonth?: boolean
  lockDaysFormat?: string
  lockDays?: DateOrRangeArray
  disallowLockDaysInRange?: boolean
  lockDaysInclusivity?: string
  bookedDaysFormat?: string
  bookedDays?: DateOrRangeArray
  disallowBookedDaysInRange?: boolean
  bookedDaysInclusivity?: string
  anyBookedDaysAsCheckout?: boolean
  highlightedDaysFormat?: string
  highlightedDays?: DateOrRangeArray
  moduleRanges?: boolean | Object
  dropdowns?: {
    minYear?: number
    maxYear?: number
    months?: 'asc' | 'desc'
    years?: 'asc' | 'desc'
  }
  ApplyButton?: React.ReactNode
  CancelButton?: React.ReactNode
  PreviousMonthButton?: React.ReactNode
  NextMonthButton?: React.ReactNode
  ResetButton?: React.ReactNode
  onReset?: () => void
  onShow?: () => void
  onHide?: () => void
  onSelect?: (date1: Date, date2?: Date) => void
  onError?: (err: Error) => void
  onRender?: (elm: Element) => void
  onRenderDay?: (elm: Element) => void
  onChangeMonth?: (date: Date, idx: number) => void
  onChangeYear?: (date: Date, idx: number) => void
  onDayHover?: (date: Date, attributes: string[]) => void
  onShowTooltip?: () => void
  noCss?: boolean
  children?: React.ForwardRefExoticComponent<any>
}

const LP = React.forwardRef<typeof LitePicker, LitePickerProps>(
  (options: LitePickerProps, ref) => {
    const [rootElm, setRootElm] = useState<HTMLDivElement | null>(null)
    const [rootEndElm, setEndRootElm] = useState<HTMLDivElement | null>(null)
    const {
      string: applyString,
      getPortal: getApplyPortal
    } = useStringAndPortal(options.ApplyButton)
    const {
      string: cancelString,
      getPortal: getCancelPortal
    } = useStringAndPortal(options.CancelButton)
    const { string: prevString, getPortal: getPrevPortal } = useStringAndPortal(
      options.PreviousMonthButton
    )
    const { string: nextString, getPortal: getNextPortal } = useStringAndPortal(
      options.NextMonthButton
    )
    const {
      string: resetString,
      getPortal: getResetPortal
    } = useStringAndPortal(options.ResetButton)

    React.useEffect(() => {
      if (rootElm) {
        const lp = new NoCssLitePicker({
          ...options,
          element: rootElm,
          endElement: rootEndElm,
          resetBtnCallback: options.onReset,
          buttonText: {
            ...(applyString ? { apply: applyString } : {}),
            ...(cancelString ? { cancel: cancelString } : {}),
            ...(prevString ? { previousMonth: prevString } : {}),
            ...(nextString ? { nextMonth: nextString } : {}),
            ...(resetString ? { reset: resetString } : {})
          }
        })
        if (typeof ref === 'function') ref(lp)
        else if (ref?.current) ref.current = lp

        return () => {
          if (typeof ref === 'function') ref(null)
          else if (ref?.current) ref.current = null
          lp.destroy()
        }
      }
      return () => {}
    })
    const {
      rootElement: Root,
      children: Child,
      endRootElement: EndRoot
    } = options

    return (
      <div>
        {Root ? (
          <Root ref={setRootElm} />
        ) : Child ? (
          <Child ref={setRootElm} />
        ) : (
          <div ref={setRootElm} />
        )}
        {getApplyPortal ? getApplyPortal() : null}
        {getCancelPortal ? getCancelPortal() : null}
        {getPrevPortal ? getPrevPortal() : null}
        {getNextPortal ? getNextPortal() : null}
        {getResetPortal ? getResetPortal() : null}
        {EndRoot ? <EndRoot ref={setEndRootElm} /> : null}
      </div>
    )
  }
)

type DomRenderable = boolean | string | number | null | undefined

let PortalCount = 0
const idState = () => `react-LitePicker-portal-wrapper-${PortalCount++}`

function useStringAndPortal(
  node: React.ReactNode
): { string: DomRenderable; getPortal?: () => React.ReactPortal | null } {
  const [id] = React.useState(idState)

  return React.useMemo(() => {
    switch (typeof node) {
      case 'function':
      case 'object':
        return {
          string: `<div id="${id}"></div>`,
          getPortal: () => {
            const root = document.getElementById(id)
            if (!root) return null
            return ReactDOM.createPortal(node, root)
          }
        }
      default:
        return { string: node as DomRenderable }
    }
  }, [id, node])
}

export default LP



interface CountLabelProps {
    counter: number
    positionClass?: string
    colorClass?: string
}

export const CountLabel = ({
    counter,
    positionClass = 'top-0 left-1/2 -translate-x-1/2 -translate-y-3/4',
    colorClass = 'bg-red-500'
}: CountLabelProps) => {
  return (
    <div className={`absolute ${positionClass} ${colorClass} ${!!counter ? 'scale-1' : 'scale-0'} delay-700  duration-300 font-bold text-white text-lg px-2 rounded-full`}>
        {counter}
    </div>
  )
}

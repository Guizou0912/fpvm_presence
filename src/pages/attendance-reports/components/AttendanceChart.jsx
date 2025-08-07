import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AttendanceChart = ({ data, type = 'line', title, height = 300 }) => {
  const formatTooltip = (value, name, props) => {
    if (name === 'attendance') {
      return [`${value} présences`, 'Présences'];
    }
    if (name === 'duration') {
      return [`${value} min`, 'Durée moyenne'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    if (type === 'line') {
      // Format date for line chart
      const date = new Date(tickItem);
      return date?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
    return tickItem;
  };

  if (type === 'bar') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        {title && (
          <h3 className="text-lg font-semibold text-card-foreground mb-4">{title}</h3>
        )}
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="var(--color-primary)" 
                name="Présences"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {title && (
        <h3 className="text-lg font-semibold text-card-foreground mb-4">{title}</h3>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label)?.toLocaleDateString('fr-FR')}
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--color-primary)' }}
            />
            {data?.[0]?.duration !== undefined && (
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'var(--color-success)' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
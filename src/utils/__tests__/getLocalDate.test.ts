import { ZoneId } from '@js-joda/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLocalDate } from '../getLocalDate'

describe('getLocalDate', () => {
  beforeEach(() => {
    vi.spyOn(ZoneId, 'systemDefault').mockImplementation(() =>
      ZoneId.of('Europe/London')
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('convert UTC datetime to local date in YYYY-MM-DD format', () => {
    const utcDateString = '2025-04-04T12:00:00Z'
    const localDate = getLocalDate(utcDateString)
    const expectedDate = '2025-04-04'
    expect(localDate).toBe(expectedDate)
  })

  describe('GMT timezone', () => {
    it('convert midnight UTC to local date', () => {
      const utcDateString = '2025-01-04T00:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-01-04'
      expect(localDate).toBe(expectedDate)
    })

    it('convert early UTC time to local date', () => {
      const utcDateString = '2025-01-03T23:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-01-03'
      expect(localDate).toBe(expectedDate)
    })

    it('convert late UTC time to local date', () => {
      const utcDateString = '2025-01-04T01:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-01-04'
      expect(localDate).toBe(expectedDate)
    })
  })

  describe('BST timezone', () => {
    it('convert midnight UTC to local date', () => {
      const utcDateString = '2025-04-04T00:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-04-04'
      expect(localDate).toBe(expectedDate)
    })

    it('convert early UTC time to local date', () => {
      const utcDateString = '2025-04-03T23:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-04-04'
      expect(localDate).toBe(expectedDate)
    })

    it('convert late UTC time to local date', () => {
      const utcDateString = '2025-04-04T01:00:00Z'
      const localDate = getLocalDate(utcDateString)
      const expectedDate = '2025-04-04'
      expect(localDate).toBe(expectedDate)
    })
  })

  it('should throw an error for invalid date strings', () => {
    const invalidDateString = 'invalid-date'
    expect(() => getLocalDate(invalidDateString)).toThrow()
  })
})
